import { FC } from "react"

import { dataset } from "../../utils/dataset"

import { Spinner } from "../"

import styles from "./index.module.scss"

declare namespace Button {
  type Props = Readonly<{
    kind?: "primary" | "secondary"
    size?: "default" | "small"
    type?: "button" | "submit" | "reset"
    disabled?: boolean
    processing?: boolean
  }>
}

const Button: FC<Button.Props> = ({
  kind = "primary",
  size = "default",
  type = "button",
  disabled = false,
  processing = false,
  children,
}) => {
  return (
    <button
      type={type}
      className={styles.button}
      {...dataset({ kind, size, disabled, processing })}
      disabled={disabled}
    >
      <div className={styles.spinnerWrapper}>
        <Spinner size="sm" color={kind === "primary" ? "white" : "brand"} />
      </div>
      <div className={styles.children}>{children}</div>
    </button>
  )
}

export { Button }