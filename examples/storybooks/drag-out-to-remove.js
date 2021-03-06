import React, { Component } from 'react';
import { DragDropContext, DropTarget } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import { SortableTreeWithoutDndContext as SortableTree } from '../../src';

// -------------------------
// Create an drop target component that can receive the nodes
// https://react-dnd.github.io/react-dnd/docs-drop-target.html
// -------------------------
// This type must be assigned to the tree via the `dndType` prop as well
const trashAreaType = 'yourNodeType';
const trashAreaSpec = {
  // The endDrag handler on the tree source will use some of the properties of
  // the source, like node, treeIndex, and path to determine where it was before.
  // The treeId must be changed, or it interprets it as dropping within itself.
  drop: (props, monitor) => ({ ...monitor.getItem(), treeId: 'trash' }),
};
const trashAreaCollect = (connect, monitor) => ({
  connectDropTarget: connect.dropTarget(),
  isOver: monitor.isOver({ shallow: true }),
});

// The component will sit around the tree component and catch
// nodes dragged out
const trashAreaBaseComponent = ({ connectDropTarget, children, isOver }) =>
  connectDropTarget(
    <div
      style={{
        height: '100vh',
        padding: 50,
        background: isOver ? 'pink' : 'transparent',
      }}
    >
      {children}
    </div>
  );
const TrashAreaComponent = DropTarget(
  trashAreaType,
  trashAreaSpec,
  trashAreaCollect
)(trashAreaBaseComponent);

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      treeData: [
        { title: '1' },
        { title: '2' },
        { title: '3' },
        { title: '4', expanded: true, children: [{ title: '5' }] },
      ],
    };
  }

  render() {
    return (
      <div>
        <TrashAreaComponent>
          <div style={{ height: 250 }}>
            <SortableTree
              treeData={this.state.treeData}
              onChange={treeData => this.setState({ treeData })}
              dndType={trashAreaType}
            />
          </div>
        </TrashAreaComponent>
      </div>
    );
  }
}

export default DragDropContext(HTML5Backend)(App);
