-- Enable client program to communicate with the server using utf8 character set
SET NAMES 'utf8';

DROP DATABASE IF EXISTS `sakila`;
-- Set the default charset to utf8 for internationalization, use case-insensitive (ci) collation
CREATE DATABASE IF NOT EXISTS `sakila` DEFAULT CHARACTER SET utf8 COLLATE utf8_unicode_ci;
USE `sakila`;

CREATE TABLE actor (
  actor_id    SMALLINT     UNSIGNED NOT NULL AUTO_INCREMENT,
                           -- 16-bit unsigned int in the range of [0, 65535]
  first_name  VARCHAR(45)  NOT NULL,
  last_name   VARCHAR(45)  NOT NULL,
  last_update TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (actor_id),
  KEY idx_actor_last_name (last_name)   -- To build index (non-unique) on last_name
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
       -- Use InnoDB Engine, which supports foreign key and transaction
       -- Use Unicode 'utf8' character set for this table

CREATE TABLE language (
  language_id  TINYINT    UNSIGNED NOT NULL AUTO_INCREMENT,
                          -- 8-bit unsigned int [0, 255]
  name         CHAR(20)   NOT NULL,
  last_update  TIMESTAMP  NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (language_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE film (
  film_id              SMALLINT     UNSIGNED NOT NULL AUTO_INCREMENT,
  title                VARCHAR(255) NOT NULL,
  description          TEXT         DEFAULT NULL,       -- Up to 64KB
  release_year         YEAR         DEFAULT NULL,       -- 'yyyy'
  language_id          TINYINT      UNSIGNED NOT NULL,  -- 8-bit unsigned int [0, 255]
  original_language_id TINYINT      UNSIGNED DEFAULT NULL,
  rental_duration      TINYINT      UNSIGNED NOT NULL DEFAULT 3,
  rental_rate          DECIMAL(4,2) NOT NULL DEFAULT 4.99,
                                    -- DECIMAL is precise and ideal for currency [99.99]. UNSIGNED?
  length               SMALLINT     UNSIGNED DEFAULT NULL,  -- 16-bit unsigned int [0, 65535]
  replacement_cost     DECIMAL(5,2) NOT NULL DEFAULT 19.99, -- [999.99], UNSIGNED??
  rating               ENUM('G','PG','PG-13','R','NC-17') DEFAULT 'G',
  special_features     SET('Trailers','Commentaries','Deleted Scenes','Behind the Scenes') DEFAULT NULL,
                                    -- Can take zero or more values from a SET
                                    -- But only one value from ENUM
  last_update          TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (film_id),
  KEY idx_title (title),
  KEY idx_fk_language_id (language_id),
  KEY idx_fk_original_language_id (original_language_id)
        -- To build index on title, language_id, original_language_id and film_id (primary key)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE film_actor (
  actor_id     SMALLINT UNSIGNED NOT NULL,
  film_id      SMALLINT UNSIGNED NOT NULL,
  last_update  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY  (actor_id, film_id),
  KEY idx_fk_film_id (`film_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;


CREATE TABLE category (
  category_id  TINYINT      UNSIGNED NOT NULL AUTO_INCREMENT,
  name         VARCHAR(25)  NOT NULL,
  last_update  TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY  (category_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE film_category (
  film_id      SMALLINT   UNSIGNED NOT NULL,
  category_id  TINYINT    UNSIGNED NOT NULL,
  last_update  TIMESTAMP  NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (film_id, category_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE film_text (
  film_id      SMALLINT      NOT NULL,
  title        VARCHAR(255)  NOT NULL,
  description  TEXT,
  PRIMARY KEY  (film_id),
  FULLTEXT KEY idx_title_description (title, description)
     -- To build index on FULLTEXT to facilitate text search
     -- FULLTEXT is supported in MyISAM engine, NOT in InnoDB engine
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

CREATE TABLE inventory (
  inventory_id  MEDIUMINT  UNSIGNED NOT NULL AUTO_INCREMENT,
                           -- Simpler to use INT UNSIGNED
  film_id       SMALLINT   UNSIGNED NOT NULL,
  store_id      TINYINT    UNSIGNED NOT NULL,
  last_update   TIMESTAMP  NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY  (inventory_id),
  KEY idx_fk_film_id (film_id),
  KEY idx_store_id_film_id (store_id, film_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE store (
  store_id          TINYINT    UNSIGNED NOT NULL AUTO_INCREMENT,
  manager_staff_id  TINYINT    UNSIGNED NOT NULL,
  address_id        SMALLINT   UNSIGNED NOT NULL,
  last_update       TIMESTAMP  NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (store_id),
  UNIQUE KEY idx_unique_manager (manager_staff_id),  -- one manager manages only one store
  KEY idx_fk_address_id (address_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE staff (
  staff_id     TINYINT     UNSIGNED NOT NULL AUTO_INCREMENT,
  first_name   VARCHAR(45) NOT NULL,
  last_name    VARCHAR(45) NOT NULL,
  address_id   SMALLINT    UNSIGNED NOT NULL,
  picture      BLOB        DEFAULT NULL,           -- Kept a picture as BLOB (up to 64KB)
  email        VARCHAR(50) DEFAULT NULL,
  store_id     TINYINT     UNSIGNED NOT NULL,
  active       BOOLEAN     NOT NULL DEFAULT TRUE,  -- BOOLEAN FALSE (0) TRUE (non-0)
  username     VARCHAR(16) NOT NULL,
  password     VARCHAR(40) BINARY DEFAULT NULL,    -- BINARY??
  last_update  TIMESTAMP   NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY  (staff_id),
  KEY idx_fk_store_id (store_id),
  KEY idx_fk_address_id (address_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE customer (
  customer_id  SMALLINT    UNSIGNED NOT NULL AUTO_INCREMENT,
  store_id     TINYINT     UNSIGNED NOT NULL,
  first_name   VARCHAR(45) NOT NULL,
  last_name    VARCHAR(45) NOT NULL,
  email        VARCHAR(50) DEFAULT NULL,
  address_id   SMALLINT    UNSIGNED NOT NULL,
  active       BOOLEAN     NOT NULL DEFAULT TRUE,
  create_date  DATETIME    NOT NULL,
  last_update  TIMESTAMP   DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY  (customer_id),
  KEY idx_fk_store_id (store_id),
  KEY idx_fk_address_id (address_id),
  KEY idx_last_name (last_name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE rental (
  rental_id     INT        NOT NULL AUTO_INCREMENT,
  rental_date   DATETIME   NOT NULL,
  inventory_id  MEDIUMINT  UNSIGNED NOT NULL,
  customer_id   SMALLINT   UNSIGNED NOT NULL,
  return_date   DATETIME   DEFAULT NULL,
  staff_id      TINYINT    UNSIGNED NOT NULL,
  last_update   TIMESTAMP  NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (rental_id),
  UNIQUE KEY  (rental_date, inventory_id, customer_id),
  KEY idx_fk_inventory_id (inventory_id),
  KEY idx_fk_customer_id (customer_id),
  KEY idx_fk_staff_id (staff_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE payment (
  payment_id    SMALLINT     UNSIGNED NOT NULL AUTO_INCREMENT,
  customer_id   SMALLINT     UNSIGNED NOT NULL,
  staff_id      TINYINT      UNSIGNED NOT NULL,
  rental_id     INT          DEFAULT NULL,
  amount        DECIMAL(5,2) NOT NULL,
  payment_date  DATETIME     NOT NULL,
  last_update   TIMESTAMP    DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY  (payment_id),
  KEY idx_fk_staff_id (staff_id),
  KEY idx_fk_customer_id (customer_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE address (
  address_id   SMALLINT    UNSIGNED NOT NULL AUTO_INCREMENT,
  address      VARCHAR(50) NOT NULL,
  address2     VARCHAR(50) DEFAULT NULL,
  district     VARCHAR(20) NOT NULL,
  city_id      SMALLINT    UNSIGNED NOT NULL,
  postal_code  VARCHAR(10) DEFAULT NULL,
  phone        VARCHAR(20) NOT NULL,
  last_update  TIMESTAMP   NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY  (address_id),
  KEY idx_fk_city_id (city_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE city (
  city_id      SMALLINT    UNSIGNED NOT NULL AUTO_INCREMENT,
  city         VARCHAR(50) NOT NULL,
  country_id   SMALLINT    UNSIGNED NOT NULL,
  last_update  TIMESTAMP   NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY  (city_id),
  KEY idx_fk_country_id (country_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE country (
  country_id   SMALLINT    UNSIGNED NOT NULL AUTO_INCREMENT,
  country      VARCHAR(50) NOT NULL,
  last_update  TIMESTAMP   NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY  (country_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
