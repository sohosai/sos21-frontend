import { FC, InputHTMLAttributes } from "react"

import { dataset } from "../../utils/dataset"

import styles from "./index.module.scss"

declare namespace TextField {
  type Props = Readonly<{
    type: "text" | "email" | "password" | "number"
    label?: string
    name?: string
    required?: boolean
    placeholder?: string
    description?: string[] | string
    error?: Array<string | false | undefined> | string | false
    autocomplete?: string
    //TODO: JSX.IntrinsicElements["input"] に変えて廃止
    inputRestAttributes?: InputHTMLAttributes<HTMLInputElement>
  }> &
    JSX.IntrinsicElements["input"]
}

const TextField: FC<TextField.Props> = ({
  type,
  label,
  name,
  required = false,
  placeholder,
  description,
  error,
  autocomplete,
  inputRestAttributes,
  ...restAttributes
}) => {
  const descriptions = (Array.isArray(description)
    ? description
    : [description]
  ).filter((text) => text)
  const errors = (Array.isArray(error)
    ? error
    : [error]
  ).filter((text): text is string => Boolean(text))

  return (
    <div className={styles.wrapper}>
      <label className={styles.label}>
        {label}
        {!required && <span className={styles.arbitrary}>(任意)</span>}
      </label>
      <input
        type={type}
        name={name}
        className={styles.input}
        autoComplete={autocomplete}
        required={required}
        placeholder={placeholder}
        {...inputRestAttributes}
        {...restAttributes}
        {...dataset({ error: Boolean(errors?.length) })}
      />
      {Boolean(descriptions?.length + errors?.length) && (
        <div className={styles.bottomText}>
          {descriptions.map((text, index) => (
            <p className={styles.description} key={index}>
              {text}
            </p>
          ))}
          {errors.map((text, index) => (
            <p className={styles.error} key={index}>
              {text}
            </p>
          ))}
        </div>
      )}
    </div>
  )
}

export { TextField }
