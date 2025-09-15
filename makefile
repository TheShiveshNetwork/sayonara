build-iso:
	# TODO: Add the build iso command

start-landing:
	cd apps/landing-page && npm run dev

deploy-contracts:
	cd blockchain/smart-contracts && npx hardhat run scripts/deploy.js --network sepolia
