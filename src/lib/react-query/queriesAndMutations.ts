import { INewUser , INewPost } from '@/types';
import { 
    useQuery,
    useMutation,
    useQueryClient,
    useInfiniteQuery
 } from '@tanstack/react-query';
import { createUserAccount, signInAccount, signOutAccount , createPost, getRecentPosts, likePost } from '../appwrite/api';
import { QUERY_KEYS } from './queryKeys';
import { likePost } from '../appwrite/api';
import { string } from 'zod';

export const useCreateUserAccount = () => {
    return useMutation({
        mutationFn: (user:INewUser) => createUserAccount(user)
    })
} 

export const useSignInAccount = () => {
    return useMutation({
        mutationFn: ( user: {email:string;
            password:string}) => signInAccount(user),
    })
} 


export const useSignOutAccount = () => {
    return useMutation({
        mutationFn: signOutAccount
    });
} 

export const useCreatePost = () => {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: (post: INewPost) => createPost(post),
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEYS.GET_RECENT_POSTS],
        });
      },
    });
  };
  

export const useGetRecentPosts = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_RECENT_POSTS], 
    queryFn: getRecentPosts,
  })
}  

export const useLikePost = () => {
  const queryClient = useQueryClient();

  return mutationFn: ({postId, LikesArray } : {postId: string; likesArray: string[] })
  => likePost(postId, LikesArray), 
  onSucess:(data) => {
    queryClient.invalidateQueries({
      queryKey: [QUERY_KEYS.GET_POST_BY_ID, data?.$id]
    })
  }


  })
}