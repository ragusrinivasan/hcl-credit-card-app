import { describe, it, expect } from 'vitest';
import { render,  } from '@testing-library/react';
import Loader from '../../components/common/Loader';

describe('Loader Component', () => {
    it('renders loading spinner', () => {
        render(<Loader />);
        const spinner = document.querySelector('.animate-spin');
        expect(spinner).toBeInTheDocument();
    });

    it('has correct styling classes', () => {
        render(<Loader />);
        const container = document.querySelector('.min-h-screen');
        expect(container).toHaveClass('bg-gray-100', 'flex', 'items-center', 'justify-center');
    });
});
