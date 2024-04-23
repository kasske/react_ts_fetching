import { useState, useEffect, ReactNode } from "react";
import { get } from "./util/http";
import BlogPosts, { BlogPost } from "./components/BlogPosts";
import fetchingImg from "./assets/data-fetching.png";
import ErrorMessage from "./components/ErrorMessage";

type RawDataBlogPost = {
  id: number;
  userId: number;
  title: string;
  body: string;
};

function App() {
  const [fetchedPosts, setFetchedPosts] = useState<BlogPost[]>();
  const [isFetching, setIsFetching] = useState(false);
  const [error, setError] = useState<string>();

  useEffect(() => {
    async function fetchedPosts() {
      setIsFetching(true);

      try {
        const data = (await get(
          "https://jsonplaceholder.typicode.com/postsasd"
        )) as RawDataBlogPost[];

        const blogPosts: BlogPost[] = data.map((rawPost) => {
          return {
            id: rawPost.id,
            title: rawPost.title,
            text: rawPost.body,
          };
        });

        setFetchedPosts(blogPosts);
      } catch (error) {
        if(error instanceof Error) { 
          setError(error.message);
        }
      }

      setIsFetching(false);
    }

    fetchedPosts();
  }, []);

  let content: ReactNode;

  if (isFetching) {
    content = <p id="loading-fallback">Fetching posts...</p>;
  }

  if (fetchedPosts) {
    content = <BlogPosts posts={fetchedPosts} />;
  }

  if(error) {
    content = <ErrorMessage text={error} />
  }

  return (
    <main>
      <img
        src={fetchingImg}
        alt="Data Fetching"
      />

      {content}
    </main>
  );
}

export default App;
