/*global app:true*/
/*eslint no-undef: "error"*/

import React, { Component } from 'react'

import '../assets/css/fa-solid.css';
import '../assets/css/fontawesome.css';
import '../css/seafile-ui.css';
import '../css/App.css';

import SeafileEditor from '../lib/seafile-editor';

import { SeafileAPI } from 'seafile-js';
import Tree from '../tree-view/tree';


class App extends Component {
  state = {
    treeData: new Tree(),
    markdownContent: "",
    loading: true
  }


 componentDidMount() {
   let repoID = app.pageOptions.repoID;
   let filePath = app.pageOptions.filePath;

   const url = `/api2/repos/${repoID}/file/?p=${filePath}&reuse=1`

   fetch(url, {credentials: 'same-origin'})
     .then(res => res.json())
     .then(res => {
       fetch(res)
         .then(res2 => res2.text())
         .then(body => {
           this.setState({
            markdownContent: body,
            loading: false
          });           
         })
     })

  }

  render() {
    if (this.state.loading) {
      return (
        <div className="empty-loading-page">
          <div className="lds-ripple page-centered"><div></div><div></div></div>
        </div>
      )
    } else {
      return (
        <SeafileEditor
          markdownContent={this.state.markdownContent}
          treeData={this.state.treeData}
          />
      );
    }
  }

}

export default App

