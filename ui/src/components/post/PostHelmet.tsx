import React from 'react'
import {Helmet} from 'react-helmet'
import {usePostFromUrl} from '../../recoil/feed'

const PostHelmet: React.FC = () => {
  const post = usePostFromUrl()
  return (
    <Helmet>
      <title> {post.title} | Chupacabra</title>
      <link rel="shortcut icon" type="image/png" href="/assets/icon/favicon.png" />
    </Helmet>
  )
}

export default PostHelmet;
