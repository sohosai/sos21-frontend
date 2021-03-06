import { Story } from "@storybook/react"

import { ProjectQuerySelector } from "."

export default {
  title: ProjectQuerySelector.name,
  component: ProjectQuerySelector,
}

export const Index: Story<ProjectQuerySelector.Props> = (options) => (
  <ProjectQuerySelector
    {...options}
    checked={{
      general: true,
      stage: false,
      cooking: true,
      food: false,
      academic: true,
      artistic: true,
      outdoor: false,
      committee: false,
    }}
  />
)

Index.argTypes = {
  checked: {
    control: false,
  },
  registers: {
    control: false,
  },
}

export {}
