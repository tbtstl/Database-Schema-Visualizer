@Entity
@Table(name="employees")
public class Employees {
  private static final long id;

  @ManyToOne(fetch=FetchType.EAGER)
  @JoinColumn(name="customers", reference_column="first_name", insertable=False, updatable=False)
  private Customer customer;
}


@Entity
@Table(name="sales_reports")
public class PurchaseOrders {
  private static final long id;

  @ManyToOne(fetch=FetchType.EAGER)
  @JoinColumn(name="orders", reference_column="id", insertable=False, updateable=False)
  private PurchaseOrder purchaseOrder;
}
