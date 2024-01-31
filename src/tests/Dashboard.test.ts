import { RenderResult, render } from '@testing-library/react';
// @ts-ignore
import Dashboard from '../Dashboard.tsx';

describe('Dashboard', () => {
    it('should render correctly', () => {
        const result: RenderResult = render(<Dashboard code="1234" />)
        expect(result.container).toBeTruthy()
    })
})
