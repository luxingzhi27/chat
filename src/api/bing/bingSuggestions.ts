import axios from 'axios';

export const bingAutoSuggest = async (query: string,key:string): Promise<string[]> => {
  return axios({
    method: 'get',
    url: `https://api.bing.microsoft.com/v7.0/suggestions?q=${encodeURIComponent(query)}`,
    headers: {
      'Ocp-Apim-Subscription-Key': key,
    },
  }).then((res) => {
    if (res.status === 200 && res.data && res.data.suggestionGroups) {
      const suggestions = res.data.suggestionGroups[0].searchSuggestions.map((suggestion: any) => suggestion.displayText);
      return suggestions;
    } else {
      return [];
    }
  });
};