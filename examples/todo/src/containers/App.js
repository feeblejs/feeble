import React from 'react'
import { StyleSheet, css } from 'aphrodite'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'

const styles = StyleSheet.create({
  root: {
    width: "380px",
    margin: "100px auto 0 auto",
  }
})

export default function App(props) {
  return (
    <MuiThemeProvider>
      <div className={css(styles.root)}>
        {props.children}
      </div>
    </MuiThemeProvider>
  )
}
