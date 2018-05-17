import axios from 'axios';
import cheerio from 'cheerio';

interface Graph {
  links: Array<{ source: string; target: string; value: number }>;
  nodes: Array<{ id: string | undefined ; group: number | undefined}>
}

const wikiRecommendations = (req: any, res: any) => {
  const { link, query } = req.body;
  axios.get(link)
  .then((result: any) => {
    const $ = cheerio.load(result.data);
    const arr = $('a');
    const recommendations: Graph = {links: [], nodes: []};

    for (let i = 13; i < arr.length; i++) {
      if (arr[i].children[0]) {
        const item: any = arr[i].children[0].data;
        if (item === '^') {
          return res.send(recommendations);
        } else if (item && item.indexOf('[') === -1 && item.indexOf('/') !== 0) {
          recommendations.nodes.push({id: item, group: 1});
          recommendations.links.push({source: query, target: item, value: 1});
        }
      }
    }
    
    res.send(recommendations);
  })
  .catch((err: any) => {
    console.log(err);
  })
}

export {
  wikiRecommendations,
  Graph
}