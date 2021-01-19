const graphql = require("graphql");

const Position = require("../mongo-models/position");

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
		id: {
			type: GraphQLID,
		},
		type: {
			type: GraphQLString,
		},
		name: {
			type: GraphQLString,
		},
		description: {
			type: GraphQLString,
		},
		price: {
			type: GraphQLFloat,
		},
		img: {
			type: GraphQLString,
		},
	}),
});

const RootQuery = new GraphQLObjectType({
	name: "RootQuery",
	fields: {
		position: {
			type: PositionType,
			args: {
				id: {
					type: GraphQLID,
				},
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
				type: {
					type: GraphQLString,
				},
			},
			resolve(parent, args) {
				return Position.find({
					type: args.type,
				});
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
				type: {
					type: new GraphQLNonNull(GraphQLString),
				},
				name: {
					type: new GraphQLNonNull(GraphQLString),
				},
				description: {
					type: new GraphQLNonNull(GraphQLString),
				},
				price: {
					type: new GraphQLNonNull(GraphQLFloat),
				},
				img: {
					type: new GraphQLNonNull(GraphQLString),
				},
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
					position.ipg = "https://i.imgur.com/h0AKNkW.png";

				return position.save();
			},
		},
	},
});

module.exports = new GraphQLSchema({
	query: RootQuery,
	mutation: Mutation,
});
