{
  "name": "sos21-frontend",
  "version": "0.1.0",
  "private": false,
  "dependencies": {
    "@react-spring/web": "9.1.2",
    "dayjs": "1.10.4",
    "ky": "0.27.0",
    "next": "10.2.0",
    "react": "17.0.2",
    "react-dom": "17.0.2",
    "react-hook-form": "7.6.0",
    "uuid": "8.3.2"
  },
  "devDependencies": {
    "@babel/core": "7.14.2",
    "@material-ui/core": "4.11.4",
    "@storybook/addon-actions": "6.2.9",
    "@storybook/addon-essentials": "6.2.9",
    "@storybook/addon-links": "6.2.9",
    "@storybook/preset-scss": "1.0.3",
    "@storybook/react": "6.2.9",
    "@types/file-saver": "2.0.2",
    "@types/node": "14.14.45",
    "@types/react": "17.0.5",
    "@types/uuid": "8.3.0",
    "@typescript-eslint/eslint-plugin": "4.23.0",
    "@typescript-eslint/parser": "4.23.0",
    "babel-loader": "8.2.2",
    "change-case": "4.1.2",
    "css-loader": "5.2.4",
    "eslint": "7.26.0",
    "eslint-config-prettier": "8.3.0",
    "eslint-plugin-jsx-a11y": "6.4.1",
    "eslint-plugin-react": "7.23.2",
    "eslint-plugin-react-hooks": "4.2.0",
    "file-saver": "2.0.5",
    "firebase": "8.6.1",
    "husky": "4.3.8",
    "lint-staged": "11.0.0",
    "next-secure-headers": "2.2.0",
    "next-transpile-modules": "7.0.0",
    "normalize.css": "8.0.1",
    "pathpida": "0.15.1",
    "prettier": "2.3.0",
    "react-dropzone": "^11.3.2",
    "sass": "1.32.13",
    "sass-loader": "10.2.0",
    "style-loader": "2.0.0",
    "typescript": "4.2.4"
  },
  "husky": {
    "hooks": {
      "pre-commit": "lint-staged"
    }
  },
  "lint-staged": {
    "*": [
      "prettier --check"
    ],
    "*.{js,jsx,ts,tsx}": [
      "eslint"
    ]
  }
}

