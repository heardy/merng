import React, { useState, Fragment } from 'react';
import gql from 'graphql-tag';
import { useMutation } from '@apollo/react-hooks';
import { Button, Confirm } from 'semantic-ui-react';

import { FETCH_POSTS_QUERY } from '../util/graphql';
import MyPopup from '../util/MyPopup';

function DeleteButton({ postId, commentId, callback}) {
  const [confirmOpen, setConfirmOpen] = useState(false);

  const mutation = commentId ? DELETE_COMMENT_MUTATION : DELETE_POST_MUTATION;

  const [deletePostOrComment] = useMutation(mutation, {
    update(proxy) {
      setConfirmOpen(false);
      
      if (!commentId) {
        const data = proxy.readQuery({
          query: FETCH_POSTS_QUERY
        });
  
        proxy.writeQuery({
          query: FETCH_POSTS_QUERY,
          data: {
            getPosts: data.getPosts.filter(p => p.id !== postId)
          }
        });
      }
      
      if(typeof callback === 'function') callback();
    },
    variables: {
      postId,
      commentId
    },
    onError() {}
  })
  
  return (
    <Fragment>
      <MyPopup
        content={commentId ? 'Delete comment' : 'Delete post'}
        inverted
      >
        <Button
          as="div"
          color="red"
          onClick={() => setConfirmOpen(true)}
          icon="trash"
          floated="right"
        />
      </MyPopup>
      <Confirm
        open={confirmOpen}
        onCancel={() => setConfirmOpen(false)}
        onConfirm={deletePostOrComment}
      />
    </Fragment>
  )
}

const DELETE_POST_MUTATION = gql`
  mutation deletePost($postId: ID!) {
    deletePost(postId: $postId)
  }
`;

const DELETE_COMMENT_MUTATION = gql`
  mutation deleteComment($postId: ID!, $commentId: ID!) {
    deleteComment(postId: $postId, commentId: $commentId) {
      id
      comments {
        id username createdAt body
      }
      commentCount
    }
  }
`;

export default DeleteButton;
