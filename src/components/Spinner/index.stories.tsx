import { Story } from "@storybook/react"

import { Spinner } from "."

export default {
  title: Spinner.name,
  component: Spinner,
}

export const Index: Story<Spinner.Props> = (options) => {
  return <Spinner {...options} />
}

Index.argTypes = {
  color: {
    defaultValue: "gray",
  },
  size: {
    defaultValue: "md",
  },
}
