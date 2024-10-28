class node {
  public value: number;
  public left: node | null;
  public right: node | null;
  constructor(_value: number, _left: node | null, _right: node | null) {
    this.value = _value;
    this.left = _left;
    this.right = _right;
  }
}

export default function Prova() {
  const node1 = new node(1, null, null);
  const node2 = new node(2, node1, null);
  const node3 = new node(3, null, null);
  const node4 = new node(4, null, null);
  const node5 = new node(5, null, null);
  const node6 = new node(6, node3, node2);
  const node7 = new node(7, null, null);
  const node8 = new node(8, node5, node4);
  const node9 = new node(9, node7, node6);
  const node10 = new node(10, node9, node8);
  function resolveNode(left: node | null, right: node | null, total: number): number {
    console.log(left, right, total);
    if (left) {
      return total + resolveNode(left.left, left.right, total + left.value);
    }
    if (right) {
      return total + resolveNode(right.left, right.right, total + right.value);
    }
    return total;
  }
  return <div>Ciao! {resolveNode(node10, null, 0)}</div>;
}
