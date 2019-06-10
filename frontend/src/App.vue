<template> 
  <div id="app">
    <!-- simple fixed header with search and reverse panels button -->
    <div class="tree-default header">
      <p>Search Text</p>
      <input type="text" @keyup="inputKeyUp" v-model="searchText" />
      <div class="switch" @click="toggle">
        <div class="tree-icon flip"></div>
        <div class="tree-icon"></div>
      </div>
    </div>
    <div class="panels" ref="panels">
      <!-- panel one -->
      <div class="panel">
        <h3>Folder 1</h3>
        <!-- custom v-jstree - https://github.com/zdy1988/vue-jstree#custom-item-example -->
        <v-jstree class="one" :data.sync="asyncData" :async="loadData" :show-checkbox="false" :allow-transition="false" ref="left" >
          <template scope="_">
            <!-- assign classes to color the results -->
            <div :class="_.model.state">
              <i :class="_.vm.themeIconClasses" role="presentation" v-if="!_.model.loading"></i>
              <!-- 1st span: name - if non-existing, take the name from the other tree for comparison display (gray and crossed out) --> 
              <!-- 2nd span: size - calculate and display the difference, leave empty if folder or equal files -->          
              <span>{{ _.model.name1 == "" ? _.model.name2 : _.model.name1 }}</span>&nbsp;&nbsp;<span>{{ ( _.model.size1 && _.model.state !=='equal' ) ? (_.model.size1 > _.model.size2 ? `+${ _.model.size1 - _.model.size2 }` : `-${ _.model.size2 - _.model.size1 }`) : '' }}</span>
            </div>
          </template>
        </v-jstree>
      </div>
      <!-- panel two -->    
      <div class="panel"> 
        <h3>Folder 2</h3>
        <v-jstree class="two" :data.sync="asyncData" :async="loadData" :show-checkbox="false" :allow-transition="false" ref="right" >
          <template scope="_">
            <div :class="_.model.state">
              <i :class="_.vm.themeIconClasses" role="presentation" v-if="!_.model.loading"></i>
              <span>{{ _.model.name2 == "" ? _.model.name1 : _.model.name2 }}</span>&nbsp;&nbsp;<span>{{ ( _.model.size2 && _.model.state !=='equal' ) ? (_.model.size2 > _.model.size1 ? `+${ _.model.size2 - _.model.size1 }` : `-${ _.model.size1 - _.model.size2 }`) : '' }}</span>
            </div>
          </template>
        </v-jstree>
      </div>
    </div>    
  </div>
</template>

<script>
import axios from 'axios'; // Promise based HTTP client for the browser and node.js - https://github.com/axios/axios
import VJstree from 'vue-jstree' // A tree plugin for vue2 - https://github.com/zdy1988/vue-jstree
export default {
  name: 'app',
  components: {
    VJstree
  },
  data: function () {
    return {
      searchText: '',
      asyncData: [],
      loadData: function (oriNode, resolve) { //function to fetch children from API based on node path
        let path1 = oriNode.data.path1 ? oriNode.data.path1 : '';
        let path2 = oriNode.data.path2 ? oriNode.data.path2 : '';
        let name1 = oriNode.data.name1 ? oriNode.data.name1 : '';
        let name2 = oriNode.data.name2 ? oriNode.data.name2 : '';        
        let data = [];
        /* if root node call the API with no parameters, if regular node form the url with path and name parameters and make the call*/
        let url = path1 == '' ? 'http://192.168.1.8:8080/api' : `http://192.168.1.8:8080/api?path1=${path1}/${name1}&path2=${path2}/${name2}`;
        axios.get(url).then((response) => {
          return response.data; // axios returns a promise
        })
        .then((result) => {
          return resolve(result); // resolve promise and return all the children nodes
        })
        .catch( error => { console.log(error); });
      },
    }
  },
  methods: {
    inputKeyUp: function () { // handler to perform search on keyup in the input
      var text = this.searchText;
      const patt = new RegExp(text);
      this.$refs.right.handleRecursionNodeChilds(this.$refs.right, highlight); // higlight results in red in both trees
      this.$refs.left.handleRecursionNodeChilds(this.$refs.left, highlight);        
      function highlight(node) { // assign 'red' class to found nodes
        let foundNode = node.$el.querySelector('.tree-anchor > div');
        if (text !== '' && node.model !== undefined) {
            const str = node.model.name1; 
            if (patt.test(str)) {
                foundNode.classList.add('red');
            } else {
                foundNode.classList.remove('red');
            } 
        } else {
            foundNode.classList.remove('red');
        }
      }
    },
    toggle: function(){ // handler to switch panel positions
      this.$refs.panels.classList.toggle('reverse');   
    },
  }   
}
</script>

<style>
/* minimal styling, vue-jstree overrides */
body {
  margin: 0;
}
* {
  box-sizing: border-box;  
}
#app {
  font-family: Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
.header{
  width: 100%;
  position: fixed; 
  padding: 15px 15px 50px 15px; 
  background-color: #fff; 
  z-index: 1;
  -webkit-box-shadow: 0px 2px 5px 0px rgba(0,0,0,0.25);
  -moz-box-shadow: 0px 2px 5px 0px rgba(0,0,0,0.25);
  box-shadow: 0px 2px 5px 0px rgba(0,0,0,0.25);  
}
.header > * {
  display: inline;
  margin-right: 15px;
}
.panel h3 {
  position: fixed;
  margin-top: -10px;
  z-index: 2;
}
.tree {
  text-align: left;
  margin-top: 40px;
}
.panels {
  display: flex;
  flex-direction: row;
}
.reverse {
  flex-direction: row-reverse;
}
.switch {
  display: inline;
  cursor: pointer;
}
.switch .tree-icon {
  background-position: -74px -68px;
  max-width: 12px;   
}
.flip {
  -moz-transform: scaleX(-1);
  -o-transform: scaleX(-1);
  -webkit-transform: scaleX(-1);
  transform: scaleX(-1);
  filter: FlipH;
  -ms-filter: "FlipH";
}
.panel {
  flex: 1; 
  margin-top: 50px; 
  padding: 15px;
}
.one .right, .two .left {
  color: gray;
  text-decoration: line-through;
}
.one .left, .two .right {
  color: green;
}
.one .distinct, .two .distinct {
  color: blue;
}
.one .red, .two .red {
  color: red;
}
</style>
