import { set, get } from 'idb-keyval';

export async function getAll() {
  const resp = await fetch('/assets/components.json');
  const data = await resp.json();

  await set('comps', data);

  return data;
}

export async function getFeatured() {
  const resp = await fetch('/assets/featured.json');
  const featuredIDs = await resp.json();

  const allComps = await getAll();

  let foundFeaturedComps: any[] = [];

  console.log(featuredIDs);

  featuredIDs.forEach((comp: any) => {
    let featured = allComps.find((allComp: any) => {
      if (allComp.ID === comp.ID) {
        return allComp;
      }
    });

    foundFeaturedComps.push(featured);
  })

  return foundFeaturedComps;
}

export async function getAComp(id: string) {
  const resp = await fetch('/assets/components.json');
  const data: any[] = await resp.json();

  const comp = data.find((comp) => {
    if (comp.ID === id) {
      return comp;
    }
  })

  return comp;
}

export async function searchComps(searchValue: string) {
  const comps: any[] = await get('comps');

  if (searchValue && comps) {
    let searchedComps = comps.filter((comp) => {
      if ((comp.name.toLowerCase() as string).includes(searchValue.toLowerCase())) {
        return comp;
      }
    })

    return searchedComps
  }
  else {
    return comps;
  }
}

export async function getDemos() {
  const demosRequest = await fetch('/assets/demos.json');
  const demos = await demosRequest.json();
  return demos;
}