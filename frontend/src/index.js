// Import React!

import React from 'react';
import ReactDOM from 'react-dom';
import './assets/css/fa-solid.css';
import './assets/css/fontawesome.css';
import './css/seafile-ui.css';
import './index.css';
import SeafileEditor from './lib/seafile-editor';

import { serverConfig } from './config';
import { SeafileAPI } from 'seafile-js';
import 'whatwg-fetch';

import Tree from './tree-view/tree';


const repoID = serverConfig.repoID;
const filePath = "/test.md";
const fileName = "test.md";
const dirPath = "/"
const seafileAPI = new SeafileAPI(serverConfig.server, serverConfig.username, serverConfig.password);


function updateFile(uploadLink, filePath, fileName, content) {
  var formData = new FormData();
  formData.append("target_file", filePath);
  formData.append("filename", fileName);
  var blob = new Blob([content], { type: "text/plain"});
  formData.append("file", blob);
  return fetch(uploadLink, {
    method: "POST",
    body: formData
  });
}

function getImageFileNameWithTimestamp() {
  var d = Date.now();
  return "image-" + d.toString() + ".png";
}

class EditorUtilities {

  saveContent(content) {
    return seafileAPI.getUpdateLink(repoID, "/").then((response) => {
      return updateFile(response.data, filePath, fileName, content);
    });
  }

  _getImageURL(fileName) {
    var url = serverConfig.server + "/lib/" + repoID + "/file/images/" + fileName + "?raw=1";
    return url;
  }

  uploadImage = (imageFile) => {
    return seafileAPI.getUploadLink(repoID, "/").then((response) => {
      const uploadLink = response.data + "?ret-json=1";
      // change image file name
      var name = getImageFileNameWithTimestamp();
      var blob = imageFile.slice(0, -1, 'image/png');
      var newFile = new File([blob], name, {type: 'image/png'});
      var formData = new FormData();
      formData.append("parent_dir", "/");
      formData.append("relative_path", "images");
      formData.append("file", newFile);
      // upload the image
      return fetch(uploadLink, {
        method: "POST",
        body: formData
      })
    }).then((response) => {
      return response.json();
    }).then((json) => {
      // The returned json is a list of uploaded files, need to get the first one
      var filename = json[0].name;
      return this._getImageURL(filename);
    });
  }

  getFileURL(fileNode) {
    var url;
    if (fileNode.isImage()) {
      url = serverConfig.server + "/lib/" + repoID + "/file" + fileNode.path() + "?raw=1";
    } else {
      url = serverConfig.server + "/lib/" + repoID + "/file" + fileNode.path();
    }
    return url;
  }

  isInternalFileLink(url) {
    var re = new RegExp(serverConfig.server + "/lib/" + "[0-9a-f\-]{36}/file.*");
    return re.test(url);
  }

}


const editorUtilities = new EditorUtilities();


class App extends React.Component {

  state = {
    treeData: new Tree(),
    markdownContent: "",
    loading: true
  }

  componentDidMount() {
    seafileAPI.login().then((response) => {

      seafileAPI.getFileDownloadLink(repoID, filePath).then((response) => {
        const url = response.data;
        fetch(url).then(function(response) {
          return response.text();
        }).then((body) => {
          this.setState({
            markdownContent: body,
            loading: false
          });
        })
      })

      seafileAPI.listDir(repoID, dirPath, { recursive: true} ).then((response) => {
        var children = response.data.map((item) => {
          return {
            name: item.name,
            type: item.type === 'dir' ? 'dir' : 'file',
            isExpanded: item.type === 'dir' ? true : false,
            parent_path: item.parent_dir
          }
        })
        // construct the tree object
        var rootObj = {
          name: '/',
          type: 'dir',
          isExpanded: true
        }
        // parse the tree object to internal representation
        var treeData = new Tree();
        treeData.parseFromList(rootObj, children);

        this.setState({
          isTreeDataLoaded: true,
          treeData: treeData
        })
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
          editorUtilities={editorUtilities}
        />
      );
    }
  }

}


ReactDOM.render(
  <App />,
  document.getElementById('root')
);
