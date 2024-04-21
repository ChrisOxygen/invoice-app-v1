function EmptyListDisplay() {
  return (
    <div className="empty-list">
      <div className="empty-list-content">
        <div className="empty-list-content__image">
          <img src="/assets/illustration-empty.svg" alt="" />
        </div>
        <h3 className="empty-list-content__title">There is nothing here</h3>
        <span className="empty-list-content__description">
          Create an invoice by clicking the New Invoice button and get started
        </span>
      </div>
    </div>
  );
}

export default EmptyListDisplay;
