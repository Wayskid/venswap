import {createClient} from '@sanity/client'
// import {getStudioEnvironmentVariables} from 'sanity/cli'

// console.log(
//   getStudioEnvironmentVariables({
//     jsonEncode: true,
//     prefix: 'process.env.',
//   }),
// )

const projectId = import.meta.env.VITE_SANITY_STUDIO_PROJECT_ID
const dataset = import.meta.env.VITE_SANITY_STUDIO_DATASET
const apiVersion = import.meta.env.VITE_SANITY_STUDIO_API_VERSION

export const sanityClient = createClient({
  projectId,
  dataset,
  useCdn: true,
  apiVersion,
})
