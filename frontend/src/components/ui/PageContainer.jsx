const PageContainer = ({ children, className = "" }) => {
  return <main className={`tg-page ${className}`}>{children}</main>;
};

export default PageContainer;
