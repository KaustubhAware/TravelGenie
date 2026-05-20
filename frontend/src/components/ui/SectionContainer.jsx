const SectionContainer = ({ children, className = "", innerClassName = "" }) => {
  return (
    <section className={`tg-section ${className}`}>
      <div className={`tg-container ${innerClassName}`}>{children}</div>
    </section>
  );
};

export default SectionContainer;
