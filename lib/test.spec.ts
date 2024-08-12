test('resolves to lemon', async () => {
	await expect(Promise.resolve('lemon')).resolves.toBe('lemon');
	await expect(Promise.resolve('lemon')).resolves.not.toBe('octopus');
});
