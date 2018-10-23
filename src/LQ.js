// https://github.com/javascript-playground/remote-data-react-screencasts/blob/master/src/Github.js
import React, { Component } from "react";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Avatar from "@material-ui/core/Avatar";
import ButtonBase from "@material-ui/core/ButtonBase";
import { FavoriteBorder, Repeat, GraphicEq, Score } from "@material-ui/icons";
import Typography from "@material-ui/core/Typography";
import CardActions from "@material-ui/core/CardActions";
import GetURL from "./GetURL";

// const urlForUsername = username => `https://api.github.com/users/mayojich`;
// another url with replies
const url1 =
  "https%3A%2F%2Ftwitter.com%2Ffchollet%2Fstatus%2F1044465230317645824";
const url2 = "https://twitter.com/miuki_miu/status/1049298310392107010";

const card = {
  marginLeft: "auto",
  marginRight: "auto",
  maxWidth: "90%",
  backgroundColor: "#f8f8f8",
  marginBottom: 10
};

const cardcontent = {
  margin: "1%"
};

const styles = {
  row: {},
  avatar: {
    display: "flex",
    justifyContent: "center",
    width: 60,
    height: 60,
    margin: 10
  },
  button: {
    fontSize: 10,
    color: "#0081AF",
    padding: "5px 15px 5px 15px",
    borderRadius: 999,
    border: "1px solid #0081AF"
  }
};

const apilink = link =>
  `https://tweet-tree-backend.herokuapp.com/v1/tweets/tree?url=${link}`;

class TweetTree extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: null
    };
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(link) {
    // fetch the data
    fetch(apilink(link))
      .then(d => d.json())
      .then(d => {
        console.log(d);
        this.setState({
          data: d
        });
      });
  }

  // do something once when the component has mounted
  componentDidMount() {
    this.handleSubmit(url1);
  }

  render() {
    // this is to if else away the state of react when there is no data
    if (!this.state.data) return <p>Hold on...</p>;

    function generateCard(data) {
      // write a functions to go through the list of entities
      const entities = data.entities; // this is a list

      // the function that looks like python loops
      // for i in some_list:
      //    # do something
      const entities_for_return = [];
      // define the function
      function pythonLikeParsing() {
        // if you look at it carefully, i'm defining an entire function inside the forEach bracket
        // if in python you're familiar with enumerate(), here the index comes after, not before
        // if you're not familiar with enumerate() have a look online
        entities.forEach(function(entity, number) {
          // return a list of jsx
          // push (js) == append (python)
          entities_for_return.push(
            <div>
              <h4>Entity {number + 1}</h4>
              <p>Label: {entity.label}</p>
              <p>Salience: {entity.salience.toFixed(4)}</p>
              <p>Type: {entity.type}</p>
            </div>
          );
        });
      }
      // call the function
      pythonLikeParsing();

      return (
        <Card style={card}>
          <CardContent style={cardcontent}>
            <Avatar src={data.images} style={styles.avatar} />
            <ButtonBase style={styles.button} target="_blank" href={data.url}>
              View Tweet
            </ButtonBase>
            <p>Text:{data.text}</p>
            {/* Begin */}
            <CardActions>
              <Repeat />
              <Typography className="badge">{data.retweets}</Typography>
              <FavoriteBorder />
              <Typography className="badge">{data.favourites}</Typography>
              <GraphicEq />
              <Typography className="badge">
                {data.sentiment.magnitude.toFixed(2)}
              </Typography>
              <Score />
              <Typography className="badge">
                {data.sentiment.score.toFixed(2)}
              </Typography>
            </CardActions>
            {/* End */}
            {/* <h3>Entities</h3>
            {entities_for_return} */}
          </CardContent>
        </Card>
      );
    }

    function allCards(data) {
      console.log("generating all cards");
      const main_card = generateCard(data);
      let child_cards = [];

      data.children.forEach(function(v) {
        child_cards.push(generateCard(v));
      });

      return [main_card, ...child_cards];
    }

    // point to note: your children cannot be called like this
    // try switching the url to url2 and you will see that react
    // cannot place an array into html
    return (
      <div style={{ fontFamily: "sans-serif" }}>
        <div style={{ textAlign: "center", padding: 20 }}>
          <h1>Tweet Sentiment</h1>
          <GetURL callBackend={this.handleSubmit} />
        </div>

        {allCards(this.state.data)}
      </div>
    );
  }
}

export default TweetTree;
