import axios from 'axios';

export interface StackOverflowQuestion {
  title: string;
  link: string;
  view_count?: number;
  answer_count?: number;
  tags?: string[];
  owner_name?: string;
}

export const getStackOverflowQuestions = async (tag:string): Promise<StackOverflowQuestion[]> => {
  const apiUrl =
    `https://api.stackexchange.com/2.3/questions?&order=desc&sort=activity&tagged=${tag}&site=stackoverflow`;
  const response = await axios({
    method: 'get',
    url: apiUrl,
  });
  if (response.status !== 200) {
    throw new Error('get Stack Overflow questions failed');
  } else {
    const questions = response.data.items.map((item: any) => ({
      title: item.title,
      link: item.link,
      view_count: item.view_count,
      answer_count: item.answer_count,
      tags: item.tags,
      owner_name: item.owner.display_name,
    }));
    return questions;
  }
};