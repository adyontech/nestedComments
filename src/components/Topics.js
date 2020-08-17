import React, { useState, useEffect } from "react";
const fetchGetOption = {
  method: "GET",
  headers: {
    "Content-Type": "application/json",
  },
  credentials: "include",
};
const dummyChild = {
  id: 2,
  comment: "hey 2",
  replies: [{ id: 3, comment: "hey 3", replies: [], via: "1, 2" }],
  via: "0, 1",
};

const dummyChild2 = {
  id: 11,
  comment: "hey from 2",
  replies: [],
  via: "2",
};

function About({ match }) {
  const [localStorageData, setlocalStorageData] = useState(null);
  const [refAllData, setRefAllData] = useState(null);
  const [userData, setsetUserData] = useState(null);
  const [postData, setPostData] = useState(null);
  const [inputVal, setinputVal] = useState("");

  const [fetchPostError, setFetchPostError] = useState(false);
  const [fetchUserError, setUserPostError] = useState(false);

  const [commentData, setCommentData] = useState([
    { id: 1, comment: "hey 1", replies: [dummyChild], via: "0" },
    dummyChild2,
  ]);

  useEffect(() => {
    // For getting and setting from local storage, it will pageWiseKeys

    // let localStorage = localStorage.getItem('commentData');
    // localStorage = JSON.parse(localStorage);

    // const thisPageComment = localStorage.filter(el => el.id == match.params.id)
    // setCommentData(thisPageComment)

    setlocalStorageData();
    async function fetchUserAPI(userId) {
      if (!userId) return;
      const url = `https://jsonplaceholder.typicode.com/users/${userId}`;
      try {
        const response = await fetch(url, fetchGetOption);
        const res = await response.json();
        setsetUserData(res);
      } catch (e) {
        setUserPostError(true);
      }
    }

    async function fetchPostAPI() {
      const url = `https://jsonplaceholder.typicode.com/posts/${match.params.id}`;
      try {
        const response = await fetch(url, fetchGetOption);
        const res = await response.json();

        setPostData(res);

        fetchUserAPI(res.userId);
      } catch (e) {
        setFetchPostError(true);
      }
    }
    fetchPostAPI();
  }, []);

  const addToBlock = (commentData, via, orgVia) => {
    const commentId = via[0];

    if (commentId == undefined) {
      console.log(commentData);
      const commentId = Math.random() * (10000 - 10) + 10;
      commentData.replies.push({
        id: commentId,
        comment: "hey 2",
        replies: [{ id: 3, comment: "hey 3", replies: [], via: "1, 2" }],
        via: orgVia + "," + commentId,
      });
      return commentData;
    }

    commentData &&
      commentData.map((el) => {
        console.log(el);
        if (el.id == commentId) {
          addToBlock(el.replies, via.shift(), orgVia);
        }
      });
    return commentData;
  };

  const addNewComment = (data) => {
    let via = data.via.split(",");
    via = via.map((el) => parseInt(el));

    const newCommentData = addToBlock(commentData, via, via);
    console.log(newCommentData);

    // setCommentData(newCommentData);

    // const newLocalStorageData = {
    //   ...localStorageData,
    //   ...{ [match.params.id]: newCommentData },
    // };

    // localStorage.setItem(JSON.stringify(newLocalStorageData));
  };

  const changeInput = (e) => {
    e.persist();
    const input = e.target.value;
    setinputVal(input);
  };

  const RenderComments = ({ data }) => {
    return (
      <div className="commentItem">
        <div className="commentBodyItem">
          {data.comment}
          <button className="addCommentBtn" onClick={() => addNewComment(data)}>
            Add
          </button>
        </div>
        {data.replies &&
          data.replies.map((el, index) => {
            return <RenderComments key={index + 24} data={{ ...el }} />;
          })}
      </div>
    );
  };

  return (
    <div className="commentBody">
      {!fetchUserError && postData ? (
        <div className="commentBody">
          <div className="headerBody">{<h3>{postData.title}</h3>}</div>
          <p>{postData.body}</p>
        </div>
      ) : (
        <p>Loading...</p>
      )}
      {fetchUserError && <p>Error occured while fetching post</p>}
      {userData ? (
        <div className="userDatabody">
          <p>{userData.name}</p>
          <p>{userData.address.city}</p>
          <p>Phone: {userData.phone}</p>
          <p> Email: {userData.email}</p>
        </div>
      ) : (
        <p>Loading...</p>
      )}
      <hr />
      <input
        placeholder="add comment"
        className="mainSearchBar"
        val={inputVal}
        onChange={changeInput}
      />
      {commentData && (
        <div>
          {/* {commentData.map((cmt) => { */}
          <div>
            {commentData.map((el, index) => {
              return <RenderComments key={index} data={el} />;
            })}
          </div>
        </div>
      )}
    </div>
  );
}
export default About;
