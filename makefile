build-iso:
	# TODO: Add the build iso command

build-core:
	cd core && cargo build

core-test:
	./core/test.sh

start-landing:
	cd apps/landing-page && bun run dev

deploy-contracts:
	cd blockchain/smart-contracts && npx hardhat run scripts/deploy.js --network sepolia
