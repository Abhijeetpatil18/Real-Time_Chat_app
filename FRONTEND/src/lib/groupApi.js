import { axiosInstance } from "./axios.js";

const CREATE_GROUP_ENDPOINT = "/groups";

export const createGroupRequest = async (payload) => {
  return axiosInstance.post(CREATE_GROUP_ENDPOINT, payload);
};

export const getGroupMessagesRequest = async (
  groupId,
  url = `/groups/${groupId}/messages`,
) => {
  return axiosInstance.get(url);
};

export const createGroupMessageRequest = async (
  groupId,
  payload,
  url = `/groups/${groupId}/messages`,
) => {
  return axiosInstance.post(url, payload);
};

export const addGroupMemberRequest = async (
  groupId,
  memberId,
  url = `/groups/${groupId}/members`,
) => {
  return axiosInstance.post(url, { memberId });
};

export const updateGroupMessageRequest = async (
  groupId,
  messageId,
  payload,
  url = `/groups/${groupId}/messages/${messageId}`,
) => {
  return axiosInstance.put(url, payload);
};

export const deleteGroupMessageRequest = async (
  groupId,
  messageId,
  url = `/groups/${groupId}/messages/${messageId}`,
) => {
  return axiosInstance.delete(url);
};
