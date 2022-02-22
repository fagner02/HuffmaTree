var root = document.querySelector(".box.parent");
var angle_range = document.querySelector("input");
var initial_angle = 15;
console.log(root);
console.log("nodes");
var nodes = [];

var tree = [];

function buildTree() {
  tree = nodes;
  if (nodes.length == 0) {
    return;
  }
  if (nodes.length == 1) {
    tree.push(nodes[0]);
    return;
  }
  var node = tree[0][0] + tree[1][0];
  var slice = tree.slice(0, 2);
  tree.splice(0, 2);
  tree.push([node, slice]);

  tree.sort((x, y) => {
    return x[0] - y[0];
  });

  if (tree.length == 1) {
    return;
  }

  buildTree();
}

var boxes = [];

function initializeTree() {
  boxes = [];
  var label = document.createElement("div");
  label.className = "label";
  root.appendChild(label);

  var text = document.createElement("h2");
  text.innerHTML = tree[0][0];
  label.appendChild(text);

  var box = document.createElement("div");
  box.className = "box";
  root.appendChild(box);

  setTimeout(() => {
    label.style.width = "50px";
    label.style.height = "50px";
    boxes.push([tree[0][0], box]);
    buildVizualizer();
  }, 10);
}

function buildVizualizer() {
  var temp_nodes = tree;

  while (temp_nodes.length > 0) {
    var temp_boxes = [];
    var temp = temp_nodes;
    temp_nodes = [];
    var count = 0;
    temp.forEach((parent_node) => {
      if (parent_node[1] == null) {
        return;
      }
      parent_node[1].forEach((node) => {
        var angle = count % 2 == 0 ? initial_angle : initial_angle * -1;
        count++;

        var box_id = boxes.findIndex((x) => {
          return x[0] == parent_node[0];
        });

        temp_boxes.push([node[0], addNode(boxes[box_id][1], node[0], angle)]);

        if (boxes[box_id][1].children.length >= 2) {
          boxes.splice(box_id, 1);
        }

        if (node[1] != null) {
          temp_nodes.push(node);
        }
      });
    });

    count = 0;
    boxes = temp_boxes;
  }
}

function addNode(node, num, angle) {
  console.log("addNode", num, angle);
  var parent = document.createElement("div");
  parent.className = "labels";

  var line = document.createElement("div");
  line.className = "line";
  parent.appendChild(line);

  var label = document.createElement("div");
  label.className = "label";
  parent.appendChild(label);

  var text = document.createElement("h2");
  text.innerHTML = num;
  label.appendChild(text);

  var box = document.createElement("div");
  box.className = "box";
  parent.appendChild(box);

  node.appendChild(parent);

  setTimeout(() => {
    line.style.height = "100px";
    setTimeout(() => {
      label.style.width = "50px";
      label.style.height = "50px";
      setTimeout(() => {
        parent.style.transform = `rotateZ(${angle}deg)`;
      }, 300);
    }, 500);
  }, 10);
  return box;
}

function updateVizualizer() {
  boxes = [root.lastChild];
  var temp_boxes;
  while (boxes.length > 0) {
    temp_boxes = [];
    var count = 0;
    boxes.forEach((parent_node) => {
      if (parent_node == null) {
        return;
      }
      var children = Array.from(parent_node.children);
      children.forEach((node) => {
        var angle = count % 2 == 0 ? initial_angle : initial_angle * -1;
        count++;

        node.style.transform = `rotateZ(${angle}deg)`;

        if (node.children[2].firstChild != null) {
          temp_boxes.push(node.children[2]);
        }
      });
    });

    count = 0;
    boxes = temp_boxes;
  }
}

angle_range.addEventListener("input", (e) => {
  initial_angle = e.target.value;
  updateVizualizer();
});

function rebuildTree() {
  console.log("rebuildTree", root);
  if (root.children.length > 0) {
    while (root.firstChild != null) {
      root.removeChild(root.firstChild);
    }
  }

  buildTree();
  initializeTree();
}

var card_id = 0;
function addCard() {
  console.log("addCard");
  var card = document.createElement("div");
  card.className = "node";
  var nodes = document.querySelector(".nodes");
  var input = document.createElement("input");
  input.type = "number";
  input.className = "num";
  input.id = card_id;
  card_id++;
  card.appendChild(input);
  document.querySelector(".add_card").before(card);
  input.addEventListener("input", (e) => {
    receiveInput(e.target);
  });
}

var inputs = {};

function receiveInput(e) {
  console.log("receiveInput", e);
  if (e.value == "") {
    return;
  }
  if (e.value < 0) {
    e.value = 0;
    return;
  }
  console.log(e.value);
  inputs[e.id] = parseInt(e.value);
  nodes = [];
  Object.values(inputs).forEach((x) => {
    console.log(x);
    nodes.push([x, null]);
  });
  nodes.sort((x, y) => {
    return x[0] - y[0];
  });
  // console.table(nodes);
  rebuildTree();
}
