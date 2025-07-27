import React, { useState, useEffect } from 'react';
import { fetchFromAPI } from "../utils/fetchFromAPI";
import { Videos, Sidebar } from "./";

const Feed = () => {
  const [selectedCategory, setSelectedCategory] = useState("New");
  const [videos, setVideos] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setVideos(null);
    setLoading(true);

    // Step 1: Fetch video IDs from the search endpoint
    fetchFromAPI(`search?part=snippet&q=${selectedCategory}`)
      .then((data) => {
        console.log('Search API response:', data);
        const videoIds = data.items.map(item => item.id.videoId).join(',');

        // Step 2: Fetch video statistics for those IDs
        return fetchFromAPI(`videos?part=snippet,statistics&id=${videoIds}`);
      })
      .then((data) => {
        console.log('Videos API response:', data);
        // Step 3: Filter videos based on view count
        const filteredVideos = data.items.filter(video => video.statistics.viewCount > 1000);
        setVideos(filteredVideos);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching videos:', error);
        setLoading(false);
      });
  }, [selectedCategory]);

  return (
    <div>
      <Sidebar setSelectedCategory={setSelectedCategory} />
      {loading ? (
        <p>Loading...</p>
      ) : (
        <Videos videos={videos} />
      )}
    </div>
  );
};

export default Feed;