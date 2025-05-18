'use client'

import LoadingCheckMate from '@/components/LoadingCheckMate'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import { TextField } from '@/components/ui/text-field'
import { useAuthStore } from '@/stores/useAuthStore'
import { Project } from '@/types/project'
import { zodResolver } from '@hookform/resolvers/zod'
import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import * as z from 'zod'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL

const formSchema = z.object({
  title: z.string().min(1, '프로젝트 이름을 입력해주세요'),
  description: z.string().optional(),
  image: z.any().optional(),
  deleteConfirmation: z.string().optional(),
})

export default function SettingsPage() {
  const { id } = useParams()
  const user = useAuthStore((state) => state.user)
  const [project, setProject] = useState<Project | null>(null)
  const [loading, setLoading] = useState(true)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      description: '',
      deleteConfirmation: '',
    },
  })

  useEffect(() => {
    if (!user?.accessToken || !id) return

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
          deleteConfirmation: '',
        })
      } catch (error) {
        console.error(error)
      } finally {
        setLoading(false)
      }
    }

    fetchProjectDetails()
  }, [id, user?.accessToken, form])

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const formData = new FormData()
      formData.append('title', values.title)
      if (values.description) formData.append('description', values.description)
      if (values.image?.[0]) formData.append('image', values.image[0])

      const response = await fetch(`${API_BASE_URL}/project/${id}`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${user?.accessToken}`,
        },
        body: formData,
      })

      if (!response.ok) {
        throw new Error('프로젝트 업데이트 실패')
      }

      toast.success('프로젝트가 성공적으로 업데이트되었습니다')
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
      const response = await fetch(`${API_BASE_URL}/project/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${user?.accessToken}`,
        },
      })

      if (!response.ok) {
        throw new Error('프로젝트 삭제 실패')
      }

      toast.success('프로젝트가 성공적으로 삭제되었습니다')
      window.location.href = '/projects'
    } catch (error) {
      console.error(error)
      toast.error('프로젝트 삭제에 실패했습니다')
    }
  }

  return (
    <>
      <LoadingCheckMate loading={loading} />
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
                <FormField<z.infer<typeof formSchema>>
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

                <FormField<z.infer<typeof formSchema>>
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

                <FormField<z.infer<typeof formSchema>>
                  control={form.control}
                  name="image"
                  render={({ field: { onChange, ...field } }) => (
                    <FormItem>
                      <FormLabel>프로젝트 이미지</FormLabel>
                      <FormControl>
                        <Input
                          type="file"
                          accept="image/*"
                          onChange={(e) => onChange(e.target.files)}
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        프로젝트를 대표할 이미지를 업로드하세요.
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
                        위험 존 ⚠️
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
                      <FormField<z.infer<typeof formSchema>>
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
