import { ReactElement } from "react"

import type { AppProps } from "next/app"
import Head from "next/head"
import type { PageOptions } from "next"

import { AuthProvider } from "../contexts/auth"
import { MyProjectProvider } from "../contexts/myProject"
import { ToastProvider } from "src/contexts/toast"

import { useIfSupported } from "../hooks/useIfSupported"

import { Layout } from "../layouts/layout"

import "normalize.css"
import "../styles/globals.scss"

function MyApp({
  Component,
  pageProps,
}: {
  Component: AppProps["Component"] & PageOptions
  pageProps: AppProps["pageProps"]
}): ReactElement {
  useIfSupported()

  return (
    <>
      <Head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <title key="title">雙峰祭オンラインシステム</title>
        <meta name="robots" content="noindex" key="robots" />
        <meta name="googlebot" content="noindex" key="googlebot" />
      </Head>
      <ToastProvider>
        <AuthProvider rbpac={Component.rbpac}>
          <MyProjectProvider>
            <Layout layout={Component.layout}>
              <Component {...pageProps} />
            </Layout>
          </MyProjectProvider>
        </AuthProvider>
      </ToastProvider>
    </>
  )
}

export default MyApp
