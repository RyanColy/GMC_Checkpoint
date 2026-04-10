import { useState } from 'react';

function toYoutubeEmbed(url) {
  if (url.includes('youtube.com/embed/')) return url;

  let videoId = null;

  const watchMatch = url.match(/[?&]v=([a-zA-Z0-9_-]{11})/);
  if (watchMatch) videoId = watchMatch[1];

  const shortMatch = url.match(/youtu\.be\/([a-zA-Z0-9_-]{11})/);
  if (shortMatch) videoId = shortMatch[1];

  return videoId ? `https://www.youtube.com/embed/${videoId}` : url;
}

function useTrailerLink() {
  const [trailerLink, setTrailerLink] = useState('');

  function handleTrailerChange(url) {
    setTrailerLink(toYoutubeEmbed(url));
  }

  function resetTrailerLink() {
    setTrailerLink('');
  }

  return { trailerLink, handleTrailerChange, resetTrailerLink };
}

export default useTrailerLink;
