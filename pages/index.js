export async function getServerSideProps() {
  return {
    redirect: { destination: '/notices', permanent: false },
  };
}

export default function Home() {
  return null;
}