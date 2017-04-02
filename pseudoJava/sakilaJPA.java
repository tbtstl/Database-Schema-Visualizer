@Entity
@Table(name="actor")
public class Actors {
  private static final long id;

  @ManyToOne(fetch=FetchType.EAGER)
  @JoinColumn(name='country', reference_column='country_id', insertable=False, updatable=False)
  private Country country
}


@Entity
@Table(name="film_actor")
public class FilmActors {
  private static final long id;

  @ManyToOne(fetch=FetchType.EAGER)
  @JoinColumn(name='film', reference_column='film_id', insertable=False, updateable=False)
  private Film film;
}
