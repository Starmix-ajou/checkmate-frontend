'use client'

import { buttonVariants } from '@cm/ui/components/ui/button'
import { cn } from '@cm/ui/lib/utils'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import * as React from 'react'
import { DayPicker } from 'react-day-picker'

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: React.ComponentProps<typeof DayPicker>) {
  return (
    <DayPicker
      navLayout="after"
      showOutsideDays={showOutsideDays}
      className={cn('p-3', className)}
      formatters={{
        formatWeekdayName: (date: Date) =>
          date.toLocaleDateString('en-US', { weekday: 'long' }).charAt(0),
      }}
      components={{
        Chevron: ({ orientation, className, ...props }) =>
          orientation === 'left' ? (
            <ChevronLeft
              className={cn(
                'size-5 hover:cursor-pointer hover:opacity-50 transition-opacity duration-200 !fill-none',
                className
              )}
              {...props}
            />
          ) : (
            <ChevronRight
              className={cn(
                'size-5 hover:cursor-pointer hover:opacity-50 transition-opacity duration-200 !fill-none',
                className
              )}
              {...props}
            />
          ),
      }}
      classNames={{
        months: 'flex flex-row gap-2 relative',
        month: 'flex flex-col gap-4 relative',
        caption: 'flex justify-center pt-1 relative items-center w-full h-10',
        caption_label: 'text-sm font-medium z-10 ml-2',
        nav: 'flex items-center justify-end absolute top-[0.1rem] right-0 gap-4',
        nav_button: cn(
          buttonVariants({ variant: 'outline' }),
          'size-7 bg-transparent p-0 opacity-50 hover:opacity-100'
        ),
        table: 'w-full border-collapse space-x-1',
        head_cell:
          'text-muted-foreground rounded-md w-8 font-light text-[0.4rem]',
        week: '',
        day: cn(
          'relative p-0 text-center text-sm focus-within:relative focus-within:z-20 [&:has([aria-selected])]:bg-accent [&:has([aria-selected].day-range-end)]:rounded-r-md',
          props.mode === 'range'
            ? '[&:has(>.day-range-end)]:rounded-r-md [&:has(>.day-range-start)]:rounded-l-md first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md'
            : '[&:has([aria-selected])]:rounded-md'
        ),
        day_button: cn(
          buttonVariants({ variant: 'ghost' }),
          'size-8 p-0 font-normal aria-selected:opacity-100 rounded-md'
        ),
        weekdays: 'text-xs text-neutral-95 font-light',
        weekday:
          'font-medium [&:nth-child(1)]:text-destructive [&:nth-child(7)]:text-destructive',
        selected:
          'bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground rounded-md',
        today: 'bg-cm rounded-full text-white',
        outside:
          'day-outside text-muted-foreground aria-selected:text-muted-foreground',
        disabled: 'text-muted-foreground opacity-50',
        hidden: 'invisible',
        range_start:
          'range_start aria-selected:bg-primary aria-selected:text-primary-foreground rounded-md',
        range_end:
          'range_end aria-selected:bg-primary aria-selected:text-primary-foreground rounded-md',
        range_middle:
          'range_middle aria-selected:bg-accent aria-selected:text-accent-foreground rounded-none',
        ...classNames,
      }}
      {...props}
    />
  )
}

export { Calendar }
