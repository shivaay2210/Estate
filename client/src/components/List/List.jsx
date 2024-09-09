import "./List.scss";
import Card from "../Card/Card";

function List({ posts }) {
  return (
    <div className="list">
      {posts.map((item) => (
        <Card
          key={item._id}
          item={item}
        />
      ))}
    </div>
  );
}

export default List;
