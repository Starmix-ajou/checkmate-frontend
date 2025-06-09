'use client'

import { useAuthStore } from '@/stores/useAuthStore'
import {
  getPresignedUrl,
  uploadFileToPresignedUrl,
} from '@cm/api/objectStorage'
import { deleteProject, putProjectSettings } from '@cm/api/projectSettings'
import { Project } from '@cm/types/project'
import LoadingScreen from '@cm/ui/components/common/LoadingScreen'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@cm/ui/components/ui/breadcrumb'
import { Button } from '@cm/ui/components/ui/button'
import { Calendar } from '@cm/ui/components/ui/calendar'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@cm/ui/components/ui/dialog'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@cm/ui/components/ui/form'
import { Input } from '@cm/ui/components/ui/input'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@cm/ui/components/ui/popover'
import { Separator } from '@cm/ui/components/ui/separator'
import { Skeleton } from '@cm/ui/components/ui/skeleton'
import { TextField } from '@cm/ui/components/ui/text-field'
import { cn } from '@cm/ui/lib/utils'
import { zodResolver } from '@hookform/resolvers/zod'
import { format } from 'date-fns'
import { CalendarIcon } from 'lucide-react'
import { useParams } from 'next/navigation'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import * as z from 'zod'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL

const formSchema = z.object({
  title: z.string().min(1, '프로젝트 이름을 입력해주세요'),
  description: z.string().min(1, '프로젝트 설명을 입력해주세요'),
  image: z.any().optional(),
  deleteConfirmation: z.string().optional(),
  endDate: z.string().min(1, '프로젝트 종료일을 입력해주세요'),
})

export default function SettingsPage() {
  const { id } = useParams()
  const user = useAuthStore((state) => state.user)
  const [project, setProject] = useState<Project | null>(null)
  const [loading, setLoading] = useState(true)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const router = useRouter()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      description: '',
      deleteConfirmation: '',
    },
  })

  const fetchProjectDetails = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/project/${id}`, {
        headers: {
          Accept: '*/*',
          Authorization: `Bearer ${user?.accessToken}`,
        },
      })

      if (!response.ok) {
        throw new Error('프로젝트 상세 정보 불러오기 실패')
      }

      const data = await response.json()
      setProject(data)
      form.reset({
        title: data.title || '',
        description: data.description || '',
        endDate: data.endDate || '',
        deleteConfirmation: '',
      })
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!user?.accessToken || !id) return
    fetchProjectDetails()
  }, [id, user?.accessToken, form])

  const uploadImage = async (file: File): Promise<string> => {
    if (!user?.accessToken) {
      console.warn('JWT 토큰이 없습니다.')
      return ''
    }

    try {
      const { presignedUrl, url } = await getPresignedUrl(user.accessToken, {
        bucket: 'PROJECT',
        fileName: file.name,
      })

      await uploadFileToPresignedUrl(presignedUrl, file)
      return url
    } catch (error) {
      console.error('이미지 업로드 에러:', error)
      throw error
    }
  }

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      let imageUrl = project?.imageUrl || ''

      if (values.image?.[0]) {
        try {
          imageUrl = await uploadImage(values.image[0])
        } catch (error) {
          console.error('이미지 업로드 실패:', error)
          toast.error('이미지 업로드에 실패했습니다')
          return
        }
      }

      await putProjectSettings({
        projectId: id as string,
        title: values.title,
        description: values.description,
        imageUrl,
        endDate: values.endDate,
        accessToken: user?.accessToken || '',
      })

      toast.success('프로젝트가 성공적으로 업데이트되었습니다')
      await fetchProjectDetails()
    } catch (error) {
      console.error(error)
      toast.error('프로젝트 업데이트에 실패했습니다')
    }
  }

  const handleDelete = async () => {
    const deleteConfirmation = form.getValues('deleteConfirmation')
    if (!deleteConfirmation || deleteConfirmation !== project?.title) {
      toast.error('프로젝트 이름이 일치하지 않습니다')
      return
    }

    try {
      await deleteProject({
        projectId: id as string,
        accessToken: user?.accessToken || '',
      })

      toast.success('프로젝트가 성공적으로 삭제되었습니다')
      router.push('/projects')
    } catch (error) {
      console.error(error)
      toast.error('프로젝트 삭제에 실패했습니다')
    }
  }

  return (
    <>
      <LoadingScreen loading={loading} />
      <div className="flex w-full">
        <div className="flex-1 p-6">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/projects">Home</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                {loading ? (
                  <Skeleton className="h-4 w-[100px]" />
                ) : (
                  <BreadcrumbLink href={`/projects/${id}/overview`}>
                    {project?.title}
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Settings</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          <div className="flex justify-between items-center mt-2 mb-4">
            {loading ? (
              <>
                <Skeleton className="h-8 w-[200px]" />
              </>
            ) : (
              <>
                <h1 className="text-3xl font-bold">{project?.title}</h1>
              </>
            )}
          </div>

          <Separator className="my-4" />

          <div>
            <div className="mb-8 flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-semibold mb-2">프로젝트 설정</h2>
                <p className="text-muted-foreground">
                  프로젝트의 기본 정보를 관리합니다.
                </p>
              </div>
              <Button type="submit" form="project-settings-form">
                저장하기
              </Button>
            </div>

            <Form {...form}>
              <form
                id="project-settings-form"
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-8"
              >
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>프로젝트 이름</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="프로젝트 이름을 입력하세요"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>프로젝트 설명</FormLabel>
                      <FormControl>
                        <TextField
                          placeholder="프로젝트에 대한 설명을 입력하세요"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="image"
                  render={({ field: { value, onChange, ...field } }) => (
                    <FormItem>
                      <FormLabel>프로젝트 이미지</FormLabel>
                      <FormControl>
                        <div className="space-y-4">
                          {project?.imageUrl && (
                            <div className="relative w-32 h-32">
                              <img
                                src={project.imageUrl}
                                alt="프로젝트 이미지"
                                className="w-full h-full object-cover rounded-lg"
                              />
                            </div>
                          )}
                          <Input
                            type="file"
                            accept="image/*"
                            onChange={(
                              e: React.ChangeEvent<HTMLInputElement>
                            ) => {
                              const files = e.target.files
                              if (files) {
                                onChange(files)
                              }
                            }}
                            {...field}
                            value={undefined}
                          />
                        </div>
                      </FormControl>
                      <FormDescription>
                        프로젝트를 대표할 이미지를 업로드하세요. (JPG, PNG, GIF
                        형식 지원)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="endDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>프로젝트 종료일</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={'outline'}
                              className={cn(
                                'w-[240px] pl-3 text-left font-normal',
                                !field.value && 'text-muted-foreground'
                              )}
                            >
                              {field.value ? (
                                format(new Date(field.value), 'PPP')
                              ) : (
                                <span>날짜를 선택하세요</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={
                              field.value ? new Date(field.value) : undefined
                            }
                            onSelect={(date: Date | undefined) =>
                              field.onChange(date?.toISOString())
                            }
                            disabled={(date: Date) =>
                              date < new Date() || date < new Date('1900-01-01')
                            }
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormDescription>
                        프로젝트의 예상 종료일을 설정하세요.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Separator className="my-8" />

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-destructive">
                        위험 구역 ⚠️
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        프로젝트를 삭제하면 모든 데이터가 영구적으로 삭제됩니다.
                      </p>
                    </div>
                    <Button
                      type="button"
                      variant="destructive"
                      onClick={() => setIsDeleteDialogOpen(true)}
                    >
                      프로젝트 삭제
                    </Button>
                  </div>

                  <Dialog
                    open={isDeleteDialogOpen}
                    onOpenChange={setIsDeleteDialogOpen}
                  >
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>프로젝트 삭제</DialogTitle>
                        <DialogDescription>
                          프로젝트를 삭제하려면 프로젝트 이름을 정확히
                          입력해주세요.
                        </DialogDescription>
                      </DialogHeader>
                      <FormField
                        control={form.control}
                        name="deleteConfirmation"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>프로젝트 이름 확인</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="프로젝트 이름을 입력하세요"
                                {...field}
                              />
                            </FormControl>
                            <FormDescription>
                              삭제할 프로젝트의 이름을 정확히 입력해주세요:{' '}
                              {project?.title}
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <DialogFooter>
                        <DialogClose asChild>
                          <Button variant="outline">취소</Button>
                        </DialogClose>
                        <Button variant="destructive" onClick={handleDelete}>
                          삭제
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </form>
            </Form>
          </div>
        </div>
      </div>
    </>
  )
}
