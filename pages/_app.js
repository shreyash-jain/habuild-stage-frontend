import "../styles/globals.css";

function MyApp({ Component, pageProps }) {
  const Layout = Component.getLayout || (({ children }) => <>{children}</>);

  return (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  );
}

export default MyApp;
