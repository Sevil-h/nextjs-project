import { Fragment } from "react";
import Head from "next/head";
import { MongoClient } from "mongodb";

import MeetupList from "../components/meetups/MeetupList";

const HomePage = (props) => {
	return (
		<Fragment>
			<Head>
				<title>React Meetups</title>
				<meta
					name="description"
					content="Browse a huge list of highly active React meetups!"
				/>
			</Head>
			<MeetupList meetups={props.meetups} />
		</Fragment>
	);
};

export async function getStaticProps() {
	// fetch data from API
	const client = await MongoClient.connect(process.env.SECRET_API_KEY);

	const db = client.db();
	const meetupsCollection = db.collection("meetups");

	const meetups = await meetupsCollection.find().toArray();

	client.close();
	return {
		props: {
			meetups: meetups.map((meetup) => ({
				title: meetup.title,
				image: meetup.image,
				address: meetup.address,
				id: meetup._id.toString(),
			})),
		},
		revalidate: 10,
	};
}

// export async function getServerSideProps(context) {
// 	const req = context.req;
// 	const res = context.res;

// 	// fetch data from an API

// 	return {
// 		props: {
// 			meetups: DUMMY_MEETUPS,
// 		},
// 	};
// }
export default HomePage;
