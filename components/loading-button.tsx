'user client';

import { forwardRef } from 'react';
import { Loader } from 'lucide-react';
import { Button, type ButtonProps } from './ui/button';

import { cn } from '@/lib/utils';

export interface LoadingButtonProps extends ButtonProps {
  loading?: boolean;
}

export const LoadingButton = forwardRef<HTMLButtonElement, LoadingButtonProps>(
  ({ loading = false, className, children, ...props }, ref) => {
    return (
      <Button
        ref={ref}
        {...props}
        disabled={props.disabled ? props.disabled : loading}
        className={cn('relative', className)}
      >
        <span className={cn(loading ? 'opacity-0' : '')}>{children}</span>
        {loading ? (
          <div className="absolute inset-0 grid place-items-center">
            <Loader className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : null}
      </Button>
    );
  }
);

LoadingButton.displayName = 'LoadingButton';
