import { useState, ReactElement } from "react"

import { DropzoneOptions, useDropzone } from "react-dropzone"
import {
  useController,
  UseControllerProps,
  Control,
  FieldPath,
} from "react-hook-form"

import { dataset } from "src/utils/dataset"

import styles from "./index.module.scss"

declare namespace Dropzone {
  type Props<T> = {
    label?: string
    descriptions?: string[]
    /**
     * name to be registered in react-hook-form
     */
    name: FieldPath<T>
    control: Control<T>
    rules?: UseControllerProps["rules"]
    triggerValidation?: () => Promise<boolean>
    errors?: Array<string | false | undefined>
    dropzoneOptions?: Omit<DropzoneOptions, "multiple">
    multiple?: boolean
  }
}

const Dropzone = function <T>({
  label,
  descriptions,
  name,
  control,
  rules,
  triggerValidation,
  errors,
  dropzoneOptions,
  multiple = false,
}: Dropzone.Props<T>): ReactElement {
  const normalizedErrors = errors?.filter((text): text is string =>
    Boolean(text)
  )

  const [dropping, setDropping] = useState(false)

  const {
    field: { onChange, value },
  } = useController({ name, control, rules })

  const { getRootProps, getInputProps } = useDropzone({
    ...dropzoneOptions,
    multiple,
    onDragEnter: (e) => {
      if (dropzoneOptions?.onDragEnter) dropzoneOptions.onDragEnter(e)
      setDropping(true)
    },
    onDragLeave: (e) => {
      if (dropzoneOptions?.onDragLeave) dropzoneOptions.onDragLeave(e)
      setDropping(false)
    },
    onDrop: async (acceptedFiles, fileRejections, event) => {
      if (dropzoneOptions?.onDrop)
        dropzoneOptions.onDrop(acceptedFiles, fileRejections, event)

      onChange(
        multiple
          ? [...(value ? Array.from(value as FileList) : []), ...acceptedFiles]
          : acceptedFiles
      )

      if (triggerValidation) await triggerValidation()

      setDropping(false)
    },
  })

  return (
    <div className={styles.wrapper}>
      {label && <p className={styles.label}>{label}</p>}
      <div
        className={styles.dropzoneWrapper}
        {...getRootProps()}
        {...dataset({ dropping, error: Boolean(normalizedErrors?.length) })}
      >
        <span className={`jam-icons jam-upload ${styles.uploadIcon}`} />
        <p className={styles.isMultipleTag}>
          {multiple ? "複数ファイル" : "単一ファイル"}
        </p>
        <p className={styles.message}>
          ファイルをドラッグアンドドロップするか、クリックしてファイルを選択できます
        </p>
        <input {...getInputProps()} />
      </div>
      {(Boolean(descriptions?.length) || Boolean(normalizedErrors?.length)) && (
        <div className={styles.bottomTextWrapper}>
          {descriptions?.map((text) => (
            <p className={styles.description} key={text}>
              {text}
            </p>
          ))}
          {normalizedErrors?.map((text) => (
            <p className={styles.error} key={text}>
              {text}
            </p>
          ))}
        </div>
      )}
    </div>
  )
}

export { Dropzone }
