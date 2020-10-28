import React from 'react'
import {useRecoilValue} from 'recoil'
import {usePostFromUrl} from '../../recoil/feed'
import {postMediaSelector} from '../../recoil/media'
import './MatrixMedia.css'

const MatrixMedia: React.FC = () => {
  const post = usePostFromUrl()
  const content = useRecoilValue(postMediaSelector(post.uri))
  return (
    <>
      {content && <iframe title={post.title} className="media-frame"
        src={`data:text/html;charset=utf-8,${escape(content)}`}
        srcDoc={content}/>}
    </>
  )
}

export default MatrixMedia;
