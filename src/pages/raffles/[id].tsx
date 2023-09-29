import React from 'react'
import { useRouter } from 'next/router'
import { useQuery } from '@tanstack/react-query'
import { fetchRaffleById } from '@/lib/fetcherFunctions'

export default function Detail() {
  const router = useRouter()
  const slug = router.query.id

  const { isLoading, isError, data, error } = useQuery({
    queryKey: ['raffleDetail', slug],
    queryFn: () => {
      if (typeof slug === "string") {
        return fetchRaffleById(slug)
      }
    },
    enabled: !!slug,
  })
  // const { isLoading, isError, data, error } = useQuery(['raffleDetail', slug], () =>
  // {  if (typeof slug === "string") {
  //   return   fetchRaffleById(slug)
  // }}

  // );
  console.log("🚀 ~ file: [id].tsx:15 ~ Detail ~ data:", data)



  return (
    <div>Detail</div>
  )
}
