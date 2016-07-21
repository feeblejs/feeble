import React from 'react'
import { StyleSheet, css } from 'aphrodite'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import { AppBar } from 'material-ui'

function getStyles() {
  return StyleSheet.create({
    root: {
      width: "380px",
      margin: "100px auto 0 auto",
    }
  })
}

export default function App(props) {
  const styles = getStyles()

  return (
    <MuiThemeProvider>
      <div className={css(styles.root)}>
        <AppBar
          title="Tuku todo example"
        />
        {props.children}
      </div>
    </MuiThemeProvider>
  )
}
