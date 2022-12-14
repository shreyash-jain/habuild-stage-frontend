import "../styles/globals.css";
import { Toaster } from "react-hot-toast";
import GlobalContextProvider from "../context/GlobalContextProvider";

function MyApp({ Component, pageProps }) {
  const Layout = Component.getLayout || (({ children }) => <>{children}</>);

  return (
    <GlobalContextProvider>
      <Layout>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 5000,
            style: {
              background: "#19222f",
              color: "#fff",
            },
            success: {
              duration: 3000,
              theme: {
                primary: "#fff",
                secondary: "#19222f",
              },
            },
          }}
        />
        <Component {...pageProps} />
      </Layout>
    </GlobalContextProvider>
  );
}

export default MyApp;
