const graphql = require("graphql");
const crypto = require("crypto");

const Position = require("../mongo-models/position");
const PayInfo = require("../mongo-models/payInfo");

const {
	GraphQLObjectType,
	GraphQLString,
	GraphQLBoolean,
	GraphQLSchema,
	GraphQLID,
	GraphQLFloat,
	GraphQLList,
	GraphQLNonNull,
	GraphQLObject,
} = graphql;

const PositionType = new GraphQLObjectType({
	name: "Position",
	fields: () => ({
		id: { type: GraphQLID },
		type: { type: GraphQLString },
		name: { type: GraphQLString },
		description: { type: GraphQLString },
		price: { type: GraphQLFloat },
		img: { type: GraphQLString },
	}),
});

const PayInfoType = new GraphQLObjectType({
	name: "PayInfo",
	fields: () => ({
		payCode: { type: GraphQLString },
		billId: { type: GraphQLString },
		date: { type: GraphQLString },
	}),
});

const RootQuery = new GraphQLObjectType({
	name: "RootQuery",
	fields: {
		position: {
			type: PositionType,
			args: {
				id: { type: GraphQLID },
			},
			resolve(parent, args) {
				return Position.findById(args.id);
			},
		},
		positions: {
			type: new GraphQLList(PositionType),
			resolve(parent, args) {
				return Position.find({});
			},
		},
		positionsByType: {
			type: new GraphQLList(PositionType),
			args: {
				type: { type: GraphQLString },
			},
			resolve(parent, args) {
				return Position.find({
					type: args.type,
				});
			},
		},
		PayInfoByBillId: {
			type: PayInfoType,
			args: {
				billId: { type: new GraphQLNonNull(GraphQLString) },
				date: { type: new GraphQLNonNull(GraphQLString) },
			},
			async resolve(parent, args) {
				if (
					(await PayInfo.count({
						billId: args.billId,
					})) != 0
				) {
					return PayInfo.findOne({
						billId: args.billId,
					});
				} else {
					if (!Number.isNaN(Number(args.date)))
						args.date = Number(args.date);
					const payinfo = new PayInfo({
						payCode: crypto
							.createHash("sha256")
							.update(`${args.date}:${Math.random()}`)
							.digest("hex"),
						billId: args.billId,
						date: new Date(args.date),
					});
					return payinfo.save();
				}
			},
		},
	},
});

const Mutation = new GraphQLObjectType({
	name: "Mutation",
	fields: {
		addPosition: {
			type: PositionType,
			args: {
				type: { type: new GraphQLNonNull(GraphQLString) },
				name: { type: new GraphQLNonNull(GraphQLString) },
				description: { type: new GraphQLNonNull(GraphQLString) },
				price: { type: new GraphQLNonNull(GraphQLFloat) },
				img: { type: GraphQLString },
			},
			resolve(parent, args) {
				const position = new Position({
					type: args.type,
					name: args.name,
					description: args.description,
					price: args.price,
					img: args.img,
				});
				if (!position.img)
					position.img = "https://i.imgur.com/h0AKNkW.png";

				return position.save();
			},
		},
	},
});

module.exports = new GraphQLSchema({
	query: RootQuery,
	mutation: Mutation,
});
