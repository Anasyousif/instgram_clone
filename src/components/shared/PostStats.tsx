import { useState , useEffect } from "react";
import { useUserContext } from "@/context/AuthContext";
import { useLikePost , useSavePost , useDeleteSavedPost , useGetCurrentUser } from "@/lib/react-query/queriesAndMutations";
import { Models } from "appwrite"
import { checkIsLiked } from "@/lib/utils";
import { likePost } from "@/lib/appwrite/api";
import { record } from "zod";
type PostStatsProps = {
    post: Models.Document;
    userId: string;


}

const PostStats = ({ post , userId }: PostStatsProps) => {
  const likesList = post.likes.map((user: Models.Document) => user.$Id)

  const [likes, setLikes] = useState(likesList);
  const [isSaved, setIsSaved] = useState(likesList);

  const {mutate: likePost } = useLikePost();
  const {mutate: savePost } = useSavePost();
  const {mutate: deleteSavedPost } = useDeleteSavedPost();

  const {data: currentUser } = useGetCurrentUser();

  const savedPostRecord = currentUser?.save.find((record: Models.Document) =>
  record.$id === post.$id);
  
  const handleLikePost = (e:React.MouseEvent) => {
    e.stopPropagation();

    let newLikes = [...likes]; 
    const hasLiked = newLikes.includes(userId)


    if(hasLiked) {
      newLikes = newLikes.filter((id) => id !== userId);
      
    } else {
      newLikes.push(userId)
    }

    setLikes(newLikes);

    setLikes(newLikes);
    likePost({ postId: post.$id , likesArray: newLikes })
  }

  const handleSavePost = (e:React.MouseEvent) => {
    e.stopPropagation();
    

    if (savedPostRecord) {
      setIsSaved(false);
      deleteSavedPost(savedPostRecord.$id);

    } else {
      savePost({postId: post.$id, userId })
      setIsSaved(true);

    }

    
  }

  return (
    <div className="flex justify-between items-center z-20">
    <div className="flex gap-2 mr-5">
     <img
     src={`${checkIsLiked(likes, userId) ? "/assets/icons/like.svg" :
     "/assets/icons/like.svg"}`}
     alt="like"
     width={20}
     height={20}
     onClick={handleLikePost}
     className="cursor-pointer"
     />
     <p className="small-meduim lg:base-meduim">{likes.length}</p>
    </div>
    <div className="flex gap-2">
     <img
     src={isSaved ?"/assets/icons/save.svg"
      :"/assets/icons/save.svg"}
     alt="like"
     width={20}
     height={20}
     onClick={handleSavePost}
     className="cursor-pointer"
     />
     <p className="small-meduim lg:base-meduim">0</p>
    </div>
    </div>
  )
}

export default PostStats