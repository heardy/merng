import React, { useState, Fragment } from 'react';
import gql from 'graphql-tag';
import { useMutation } from '@apollo/react-hooks';
import { Button, Confirm } from 'semantic-ui-react';

import { FETCH_POSTS_QUERY } from '../util/graphql';

function DeleteButton({ postId, callback}) {
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [deletePost] = useMutation(DELETE_POST_MUTATION, {
    update(proxy) {
      setConfirmOpen(false);
      
      const data = proxy.readQuery({
        query: FETCH_POSTS_QUERY
      });

      proxy.writeQuery({
        query: FETCH_POSTS_QUERY,
        data: {
          getPosts: data.getPosts.filter(p => p.id !== postId)
        }
      });
      
      if(typeof callback === 'function') callback();
    },
    variables: {
      postId
    },
    onError() {}
  })
  
  return (
    <Fragment>
      <Button
        as="div"
        color="red"
        onClick={() => setConfirmOpen(true)}
        icon="trash"
        floated="right"
      />
      <Confirm
        open={confirmOpen}
        onCancel={() => setConfirmOpen(false)}
        onConfirm={deletePost}
      />
    </Fragment>
  )
}

const DELETE_POST_MUTATION = gql`
  mutation deletePost($postId: ID!) {
    deletePost(postId: $postId)
  }
`

export default DeleteButton;
